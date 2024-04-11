import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export const dbFS = getFirestore(app);
interface Data {
  dna: string;
  edition: number;
  name: string;
  tokenId: number;
  description: string;
  image: string;
  price: string;
}

export const saveData = async (data: Data) => {
  try {
    set(ref(db, '/data/'.concat(data.tokenId.toString())), data);
  } catch (error) {
    console.log(error);
  }
};

export const getData = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reference = ref(db, 'data');
    onValue(
      reference,
      (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};
