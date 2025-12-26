import mongoose from 'mongoose';

// Convert SRV connection string to direct connection format
function convertSrvToDirect(uri) {
  if (!uri.includes('mongodb+srv://')) {
    return uri; // Already direct connection
  }

  // Extract credentials and host from SRV URI
  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/);
  if (!match) {
    return uri; // Return as-is if parsing fails
  }

  const [, username, password, host, rest] = match;
  
  // Convert Cosmos DB vCore SRV hostname to direct format
  // blog-app.global.mongocluster.cosmos.azure.com -> blog-app.mongo.cosmos.azure.com
  let directHost = host;
  if (host.includes('.global.mongocluster.cosmos.azure.com')) {
    directHost = host.replace('.global.mongocluster.cosmos.azure.com', '.mongo.cosmos.azure.com');
  }

  // Build direct connection string
  const directUri = `mongodb://${username}:${password}@${directHost}:10255/${rest}`;
  
  // Ensure SSL and other Cosmos DB required parameters
  const separator = rest.includes('?') ? '&' : '?';
  return `${directUri}${separator}ssl=true&replicaSet=globaldb&retrywrites=false&appName=@blog-app@`;
}

export async function connectToDatabase() {
  let mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }

  // Convert SRV to direct connection if needed (for Azure App Service DNS issues)
  if (mongoUri.includes('mongodb+srv://')) {
    console.log('Converting SRV connection string to direct format...');
    mongoUri = convertSrvToDirect(mongoUri);
    console.log('Using direct connection string');
  }

  mongoose.set('strictQuery', true);
  
  // Connection options for Azure Cosmos DB
  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
    connectTimeoutMS: 30000, // 30 seconds
    retryWrites: false, // Cosmos DB doesn't support retryWrites
    directConnection: true, // Use direct connection instead of SRV
  };

  try {
    await mongoose.connect(mongoUri, options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}


