import React, { Component } from "react";
import "./App.css";
import { fetchDataBase } from "./api";
import {
  createCommentsCollection,
  createUsersCollection,
  createSolutionManualsCollection,
  createChaptersCollection,
  createSubchaptersCollection,
  createExercisesCollection,
  createVotesCollection,
  createAnswersCollection,
  createSuggestedBooksCollection,
  createServiceRequestsCollection
} from "./utils/firestore";
import db from "./constants/ref";
import { divideArrIntoArrays } from "./utils/array";

class App extends Component {
  constructor() {
    super();
    this.state = {
      uploadingBatch: false,
      oldData: "",
      comments: [],
      batchsComments: 1,
      users: [],
      batchsUsers: 1,
      chapters: [],
      batchsChapters: 1,
      subchapters: [],
      batchsSubchapters: 1,
      votes: [],
      batchsVotes: 1,
      exercises: [],
      batchsExercises: 1,
      serviceRequests: [],
      batchsServiceRequests: 1,
      suggestedBooks: [],
      batchsSuggestedBooks: 1,
      solutionManuals: [],
      batchsSolutionManuals: 1
    };
    this.toggleButtonState = this.toggleButtonState.bind(this);
    this.uploadComments = this.uploadComments.bind(this);
    this.uploadUsers = this.uploadUsers.bind(this);
    this.uploadChapters = this.uploadChapters.bind(this);
    this.uploadSubchapters = this.uploadSubchapters.bind(this);
    this.uploadExercises = this.uploadExercises.bind(this);
    this.uploadVotes = this.uploadVotes.bind(this);
    this.uploadAnswers = this.uploadAnswers.bind(this);
    this.uploadSolutionManuals = this.uploadSolutionManuals.bind(this);
    this.uploadServiceRequests = this.uploadServiceRequests.bind(this);
    this.uploadSuggestedBooks = this.uploadSuggestedBooks.bind(this);
    this.uploadBatchs = this.uploadBatchs.bind(this);
    this.fetchOldData = this.fetchOldData.bind(this);
  }
  componentDidMount() {
    this.firestore = db.firestore();
    this.firestore.settings({ timestampsInSnapshots: true });
  }
  toggleButtonState() {
    this.setState({
      uploadingBatch: !this.state.uploadingBatch
    });
  }
  fetchOldData() {
    this.toggleButtonState();
    fetchDataBase().then(data => {
      const maxElementInBatch = 500;
      const users = createUsersCollection(data);
      const batchsUsers = Math.ceil(users.length / maxElementInBatch);
      const comments = createCommentsCollection(data);
      const batchsComments = Math.ceil(comments.length / maxElementInBatch);
      const solutionManuals = createSolutionManualsCollection(data);
      const batchsSolutionManuals = Math.ceil(
        solutionManuals.length / maxElementInBatch
      );
      const chapters = createChaptersCollection(data);
      const batchsChapters = Math.ceil(chapters.length / maxElementInBatch);
      const votes = createVotesCollection(data);
      const batchsVotes = Math.ceil(votes.length / maxElementInBatch);
      const subchapters = createSubchaptersCollection(data);
      const batchsSubchapters = Math.ceil(
        subchapters.length / maxElementInBatch
      );
      const exercises = createExercisesCollection(data);
      const batchsExercises = Math.ceil(exercises.length / maxElementInBatch);
      const answers = createAnswersCollection(data);
      const batchsAnswers = Math.ceil(answers.length / maxElementInBatch);
      const suggestedBooks = createSuggestedBooksCollection(data);
      const batchsSuggestedBooks = Math.ceil(
        suggestedBooks.length / maxElementInBatch
      );
      const serviceRequests = createServiceRequestsCollection(data);
      const batchsServiceRequests = Math.ceil(
        serviceRequests.length / maxElementInBatch
      );
      this.setState({
        oldData: data,
        comments: divideArrIntoArrays(comments, batchsComments, true),
        batchsComments,
        users: divideArrIntoArrays(users, batchsUsers, true),
        batchsUsers,
        chapters: divideArrIntoArrays(chapters, batchsChapters, true),
        batchsChapters,
        subchapters: divideArrIntoArrays(subchapters, batchsSubchapters, true),
        batchsSubchapters,
        votes: divideArrIntoArrays(votes, batchsVotes, true),
        batchsVotes,
        exercises: divideArrIntoArrays(exercises, batchsExercises, true),
        batchsExercises,
        answers: divideArrIntoArrays(answers, batchsAnswers, true),
        batchsAnswers,
        suggestedBooks: divideArrIntoArrays(
          suggestedBooks,
          batchsSuggestedBooks,
          true
        ),
        batchsSuggestedBooks,
        serviceRequests: divideArrIntoArrays(
          serviceRequests,
          batchsServiceRequests,
          true
        ),
        batchsServiceRequests,
        solutionManuals: divideArrIntoArrays(
          solutionManuals,
          batchsSolutionManuals,
          true
        ),
        batchsSolutionManuals,
        uploadingBatch: !this.state.uploadingBatch
      });
    });
  }
  uploadBatchs(collection, batchs, collectionName, callBackFn) {
    console.warn(collection, batchs, collectionName);
    const UppercaseName =
      collectionName[0].toUpperCase() + collectionName.substring(1);
    if (batchs > 0) {
      const batch = this.firestore.batch();
      collection[batchs - 1].forEach(item => {
        if (item.id) {
          const key = this.firestore.collection(collectionName).doc(item.id);
          batch.set(key, item);
        }
      });
      this.toggleButtonState();
      batch.commit().then(() => {
        this.setState({
          uploadingBatch: !this.state.uploadingBatch,
          [`batchs${UppercaseName}`]: this.state[`batchs${UppercaseName}`] - 1
        });
        callBackFn();
      });
    }
  }
  uploadComments() {
    const { comments, batchsComments } = this.state;
    if (batchsComments) {
      this.uploadBatchs(
        comments,
        batchsComments,
        "comments",
        this.uploadComments
      );
    }
  }
  uploadUsers() {
    const { users, batchsUsers } = this.state;
    if (batchsUsers) {
      this.uploadBatchs(users, batchsUsers, "users", this.uploadUsers);
    }
  }
  uploadChapters() {
    const { chapters, batchsChapters } = this.state;
    if (batchsChapters) {
      this.uploadBatchs(
        chapters,
        batchsChapters,
        "chapters",
        this.uploadChapters
      );
    }
  }
  uploadSubchapters() {
    const { subchapters, batchsSubchapters } = this.state;
    if (batchsSubchapters) {
      this.uploadBatchs(
        subchapters,
        batchsSubchapters,
        "subchapters",
        this.uploadSubchapters
      );
    }
  }
  uploadExercises() {
    const { exercises, batchsExercises } = this.state;
    if (batchsExercises) {
      this.uploadBatchs(
        exercises,
        batchsExercises,
        "exercises",
        this.uploadExercises
      );
    }
  }
  uploadVotes() {
    const { votes, batchsVotes } = this.state;
    if (batchsVotes) {
      this.uploadBatchs(votes, batchsVotes, "votes", this.uploadVotes);
    }
  }
  uploadAnswers() {
    const { answers, batchsAnswers } = this.state;
    if (batchsAnswers) {
      this.uploadBatchs(answers, batchsAnswers, "answers", this.uploadAnswers);
    }
  }
  uploadServiceRequests() {
    const { serviceRequests, batchsServiceRequests } = this.state;
    if (batchsServiceRequests) {
      this.uploadBatchs(
        serviceRequests,
        batchsServiceRequests,
        "serviceRequests",
        this.uploadServiceRequests
      );
    }
  }
  uploadSuggestedBooks() {
    const { suggestedBooks, batchsSuggestedBooks } = this.state;
    if (batchsSuggestedBooks) {
      this.uploadBatchs(
        suggestedBooks,
        batchsSuggestedBooks,
        "suggestedBooks",
        this.uploadSuggestedBooks
      );
    }
  }
  uploadSolutionManuals() {
    const { solutionManuals, batchsSolutionManuals } = this.state;
    if (batchsSolutionManuals) {
      this.uploadBatchs(
        solutionManuals,
        batchsSolutionManuals,
        "solutionManuals",
        this.uploadSolutionManuals
      );
    }
  }
  render() {
    const {
      uploadingBatch,
      oldData,
      batchsUsers,
      batchsComments,
      batchsChapters,
      batchsSubchapters,
      batchsExercises,
      batchsVotes,
      batchsAnswers,
      batchsServiceRequests,
      batchsSuggestedBooks,
      batchsSolutionManuals
    } = this.state;
    return (
      <div className="container">
        {!oldData && (
          <button
            className="button"
            disabled={uploadingBatch}
            onClick={this.fetchOldData}
          >
            Load old Database
          </button>
        )}
        {oldData && (
          <div>
            <p className="text">Click on the collection you want to upload</p>
            <div>
              <button
                className={
                  batchsComments === 0 ? "button button--succes" : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadComments}
              >
                Comments ({batchsComments})
              </button>
              <button
                className={
                  batchsUsers === 0 ? "button button--succes" : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadUsers}
              >
                Users ({batchsUsers})
              </button>
              <button
                className={
                  batchsSolutionManuals === 0
                    ? "button button--succes"
                    : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadSolutionManuals}
              >
                Solution Manuals ({batchsSolutionManuals})
              </button>
            </div>
            <div>
              <button
                className={
                  batchsChapters === 0 ? "button button--succes" : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadChapters}
              >
                Chapters ({batchsChapters})
              </button>
              <button
                className={
                  batchsSubchapters === 0 ? "button button--succes" : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadSubchapters}
              >
                Subchapters ({batchsSubchapters})
              </button>
              <button
                className={
                  batchsExercises === 0 ? "button button--succes" : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadExercises}
              >
                Exercises ({batchsExercises})
              </button>
            </div>
            <div>
              <button
                className={
                  batchsVotes === 0 ? "button button--succes" : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadVotes}
              >
                Votes ({batchsVotes})
              </button>
              <button
                className={
                  batchsAnswers === 0 ? "button button--succes" : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadAnswers}
              >
                Answers ({batchsAnswers})
              </button>
              <button
                className={
                  batchsServiceRequests === 0
                    ? "button button--succes"
                    : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadServiceRequests}
              >
                Service Requests ({batchsServiceRequests})
              </button>
            </div>
            <div>
              <button
                className={
                  batchsSuggestedBooks === 0
                    ? "button button--succes"
                    : "button"
                }
                disabled={uploadingBatch}
                onClick={this.uploadSuggestedBooks}
              >
                Suggested Books ({batchsSuggestedBooks})
              </button>
            </div>
          </div>
        )}
        {uploadingBatch && (
          <p className="text">{oldData ? "Uploading" : "Loading"}...</p>
        )}
      </div>
    );
  }
}

export default App;
