import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.dbUrl);
        console.log("MongoDB connected successfully");

        // Defensive step: if an old 2dsphere index exists on `location`, drop it.
        try {
            const db = conn.connection.db;
            const coll = db.collection('items');
            const indexes = await coll.indexes();
            for (const idx of indexes) {
                if (idx.key && Object.keys(idx.key).length === 1 && idx.key.location === '2dsphere') {
                    console.log('Dropping old 2dsphere index on `location` to avoid GeoJSON shape mismatch.');
                    await coll.dropIndex(idx.name);
                }
            }
        } catch (indexErr) {
            console.warn('Index cleanup check failed or not required:', indexErr.message);
        }
        // Ensure model indexes are created (especially the new 2dsphere on location.geo)
        try {
            // Importing model here to call init (avoid circular imports elsewhere)
            const Item = await import('../models/item.model.js');
            if (Item && Item.default && Item.default.init) {
                await Item.default.init();
                console.log('Ensured item model indexes are created.');
            }
        } catch (initErr) {
            console.warn('Failed to init Item model indexes:', initErr.message);
        }
    }catch(error){
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;
