import { db } from "./config";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc
} from "firebase/firestore";

// Add data
export const addItem = (col, data) => addDoc(collection(db, col), data);

// Get all data
export const getAll = (col) => getDocs(collection(db, col));

// Update
export const updateItem = (col, id, data) => updateDoc(doc(db, col, id), data);

// Delete
export const deleteItem = (col, id) => deleteDoc(doc(db, col, id));
