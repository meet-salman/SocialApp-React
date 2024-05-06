import app from "./firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, getDocs, query, where, doc, orderBy } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Signup User
let signUpUser = (obj) => {

    return new Promise((resolve, reject) => {

        createUserWithEmailAndPassword(auth, obj.email, obj.password)
            .then(async (res) => {

                obj.userUid = res.user.uid;
                delete obj.password;
                resolve(obj);

                // Adding User to Db
                await addDoc(collection(db, "users"), obj)
                    .then((res) => {
                        console.log("User Added to DB!");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                reject(err.message);
            });
    });
};


// Login User
let loginUser = (obj) => {

    return new Promise((resolve, reject) => {


        signInWithEmailAndPassword(auth, obj.email, obj.password)
            .then(async () => {

                let userData;

                const q = query(collection(db, "users"), where("userUid", "==", auth.currentUser.uid));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    resolve(doc.data());
                    // userData = { ...doc.data(), docId: doc.id }
                    // resolve(userData);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};


// SignOut User
const signOutUser = () => {
    return new Promise((resolve, reject) => {
        signOut(auth)
            .then(() => {
                resolve("User Signout Successfully");
            })
            .catch((error) => {
                reject(error);
            });
    });
};


// Add Data to Firestore DB
const addData = (obj, collName) => {

    return new Promise((resolve, reject) => {

        addDoc(collection(db, collName), obj)
            .then((res) => {
                resolve("Data Send to DB Successfully!");
            })
            .catch((err) => {
                reject(err);
            });
    });
};


// Get Single Data with ID from DB
const getData = (collName, idKey, uid) => {
    return new Promise(async (resolve, reject) => {

        const q = query(collection(db, collName), where(idKey, "==", uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            resolve({ ...doc.data(), docId: doc.id });
        });
        reject("error occured");
    });
};


// Get Data In Order with ID from DB
const getDataInOrder = (collName, idKey, uid, byOrder, inOrder) => {
    return new Promise(async (resolve, reject) => {

        const data = [];

        const q = query(collection(db, collName), where(idKey, "==", uid), orderBy(byOrder, inOrder));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const obj = { ...doc.data(), docId: doc.id }
            data.push(obj)
            resolve(data);
        });
        reject("error occured");
    });
};


// Get All Data from DB
const getAllData = (collName) => {

    return new Promise(async (resolve, reject) => {

        const data = [];
        const querySnapshot = await getDocs(collection(db, collName));

        querySnapshot.forEach((doc) => {
            const obj = { ...doc.data(), docId: doc.id }
            data.push(obj)
            resolve(data);
        });
        reject("error occured")
    })
};


// Add Data to Firestore DB
const uploadFile = (fileName, file) => {

    return new Promise((resolve, reject) => {

        const storageRef = ref(storage, fileName);

        uploadBytes(storageRef, file)
            .then(() => {
                console.log('File Uploaded!');

                getDownloadURL(storageRef)
                    .then((url) => {
                        resolve(url);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
            .catch((err) => {
                reject(err);
            })
    });
};


// Delete Document by ID from DB
const deleteDocument = async (collName, id) => {

    return new Promise((resolve, reject) => {

        deleteDoc(doc(db, collName, id));
        resolve("document deleted")

        reject("error occured")
    })
}


// Update Document by ID in DB
const updateDocument = async (obj, collName, id) => {

    return new Promise((resolve, reject) => {

        updateDoc(doc(db, collName, id), obj)
        resolve("document updated")

        reject("error occured")
    })
}


export { auth, db, signUpUser, loginUser, signOutUser, addData, getData, getDataInOrder, getAllData, uploadFile, deleteDocument, updateDocument };