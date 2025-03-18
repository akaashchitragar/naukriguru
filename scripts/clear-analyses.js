const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch, query, orderBy, limit } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-tg5YgM5e-bCGVh-I8DYN-oB44q83lcY",
  authDomain: "naukri-guru.firebaseapp.com",
  projectId: "naukri-guru",
  storageBucket: "naukri-guru.appspot.com",
  messagingSenderId: "475274911587",
  appId: "1:475274911587:web:bb486df7c9aea8ed5e0fcb",
  measurementId: "G-T5LCPNGSV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearAnalyses() {
  try {
    console.log('🔄 Fetching all analyses from Firestore...');
    
    // Get all analyses
    const analysesRef = collection(db, 'analyses');
    const analysesSnapshot = await getDocs(analysesRef);
    
    if (analysesSnapshot.empty) {
      console.log('No analyses found in the database.');
      return;
    }
    
    const totalDocs = analysesSnapshot.docs.length;
    console.log(`📊 Found ${totalDocs} analyses to delete.`);
    
    // Delete all analyses in batches (Firestore batch limit is 500)
    const batchSize = 500;
    let batchCount = 0;
    let totalDeleted = 0;
    
    // Process in batches
    for (let i = 0; i < totalDocs; i += batchSize) {
      const batch = writeBatch(db);
      const currentBatchDocs = analysesSnapshot.docs.slice(i, Math.min(i + batchSize, totalDocs));
      
      currentBatchDocs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      batchCount++;
      totalDeleted += currentBatchDocs.length;
      console.log(`✅ Batch ${batchCount} completed: Deleted ${currentBatchDocs.length} analyses.`);
    }
    
    console.log(`🎉 Successfully deleted all ${totalDeleted} analyses!`);
  } catch (error) {
    console.error('❌ Error clearing analyses:', error);
  }
}

clearAnalyses(); 