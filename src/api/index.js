import firebase from "../constants/ref";

async function fetchDataBase() {
  const db = await firebase
    .database()
    .ref("/")
    .once("value");
  return db.val();
}

export { fetchDataBase };
