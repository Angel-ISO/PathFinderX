import { connect } from 'mongoose';

const DbConect = async () => {
  try {
    const db = await connect(process.env.Mongo_Uri);
    console.log('Connected to database successfully');
    return db;
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};

DbConect();

export default DbConect;
