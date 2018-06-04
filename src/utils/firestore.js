import { firestore } from "firebase";
import _ from "lodash";

export function createCommentsCollection(data) {
  const newObj = _.cloneDeep(data);
  const { comments } = newObj;
  return Object.keys(comments).map(comment => {
    const oldComment = comments[comment];
    const newComment = {
      answerId: (oldComment.answerAuthor && oldComment.answerAuthor.id) || null,
      authorId: (oldComment.author && oldComment.author.id) || null,
      chapterId: oldComment.chapterId || null,
      commentId: oldComment.commentId || null,
      createdAt:
        (oldComment.date && new Date(oldComment.date)) ||
        firestore.FieldValue.serverTimestamp(),
      exerciseId: oldComment.exerciseId || null,
      id: oldComment.id,
      solutionManualId: oldComment.solutionManualId || null,
      subchapterId: oldComment.subchapterId || null,
      text: oldComment.text || null
    };
    return newComment;
  });
}

export function createUsersCollection(data) {
  const newObj = _.cloneDeep(data);
  const { users } = newObj;
  return Object.keys(users).reduce((acc, user) => {
    const oldUser = users[user];
    const newUser = {
      ...oldUser,
      createdAt:
        (oldUser.createdAt && new Date(oldUser.createdAt)) ||
        firestore.FieldValue.serverTimestamp()
    };
    delete newUser.searches;
    if (newUser.id && newUser.displayName) acc.push(newUser);
    return acc;
  }, []);
}

export function createVotesCollection(data) {
  const newObj = _.cloneDeep(data);
  const { users } = newObj;
  const votesCollection = Object.keys(users).reduce((acc, user) => {
    const oldUser = users[user];
    if (oldUser.id && oldUser.displayName && oldUser.votes) {
      Object.keys(oldUser.votes).forEach(item => {
        const votes = {
          ...oldUser.votes[item],
          voterId: oldUser.id,
          createdAt: firestore.FieldValue.serverTimestamp()
        };
        delete votes.chapterNumber;
        delete votes.exerciseNumber;
        acc.push(votes);
      });
    }
    return acc;
  }, []);
  return votesCollection;
}

export function createServiceRequestsCollection(data) {
  const newObj = _.cloneDeep(data);
  const { serviceRequests } = newObj;
  const serviceRequestsCollection = Object.keys(serviceRequests).map(item => ({
    ...serviceRequests[item],
    createdAt: firestore.FieldValue.serverTimestamp()
  }));
  return serviceRequestsCollection;
}

export function createSuggestedBooksCollection(data) {
  const newObj = _.cloneDeep(data);
  const { suggestedBooks } = newObj;
  const suggestedBooksCollection = Object.keys(suggestedBooks).map(item => ({
    name: suggestedBooks[item],
    id: item,
    createdAt: firestore.FieldValue.serverTimestamp()
  }));
  return suggestedBooksCollection;
}

export function createSolutionManualsCollection(data) {
  const newObj = _.cloneDeep(data);
  const { solutionManuals } = newObj;
  return Object.keys(solutionManuals).map(solutionManual => {
    const oldSolMan = solutionManuals[solutionManual];
    const authors = oldSolMan.name
      .substr(0, oldSolMan.name.indexOf("-"))
      .trim();
    const edition = oldSolMan.name
      .split(" ")
      .splice(-2)
      .join(" ");
    const name = oldSolMan.name
      .match(new RegExp(authors + "(.*)" + edition))[1]
      .trim()
      .substr(2);
    const newSolutionManual = {
      ...oldSolMan,
      createdAt: new Date(oldSolMan.createdAt),
      authors,
      edition,
      name
    };
    delete newSolutionManual.chapters;
    delete newSolutionManual.pageTitle;
    return newSolutionManual;
  });
}

export function createChaptersCollection(data) {
  const newObj = _.cloneDeep(data);
  const { solutionManuals } = newObj;
  const solutionManualsKeys = Object.keys(solutionManuals);
  const solutionManualsArr = solutionManualsKeys.map(solutionManual => {
    const oldSolutionManual = solutionManuals[solutionManual];
    const newSolutionManual = {
      ...oldSolutionManual.chapters
    };
    Object.keys(newSolutionManual).forEach(item => {
      newSolutionManual[item].solutionManualId = solutionManual;
      delete newSolutionManual[item].exercises;
      delete newSolutionManual[item].subchapters;
    });
    return newSolutionManual;
  });
  const chaptersCollection = solutionManualsArr.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      acc.push({
        ...item[key]
      });
    });
    return acc;
  }, []);
  return chaptersCollection;
}

export function createSubchaptersCollection(data) {
  const newObj = _.cloneDeep(data);
  const { solutionManuals } = newObj;
  const solutionManualsKeys = Object.keys(solutionManuals);
  const solutionManualsArr = solutionManualsKeys.map(solutionManual => {
    const oldSolutionManual = solutionManuals[solutionManual];
    const newSolutionManual = {
      ...oldSolutionManual.chapters
    };
    Object.keys(newSolutionManual).forEach(item => {
      newSolutionManual[item].solutionManualId = solutionManual;
      delete newSolutionManual[item].exercises;
    });
    return newSolutionManual;
  });
  const chaptersCollection = solutionManualsArr.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (item[key].subchapters) {
        acc.push({
          ...item[key]
        });
      }
    });
    return acc;
  }, []);
  const subchaptersCollection = chaptersCollection.reduce((acc, item) => {
    const subchapters = {
      ...item.subchapters
    };
    Object.keys(subchapters).forEach(key => {
      subchapters[key].chapterId = item.id;
      subchapters[key].solutionManualId = item.solutionManualId;
      delete subchapters[key].exercises;
      acc.push({ ...subchapters[key] });
    });
    return acc;
  }, []);
  return subchaptersCollection;
}

export function createExercisesCollection(data) {
  const newObj = _.cloneDeep(data);
  const { solutionManuals } = newObj;
  const solutionManualsKeys = Object.keys(solutionManuals);
  const solutionManualsArr = solutionManualsKeys.map(solutionManual => {
    const oldSolutionManual = solutionManuals[solutionManual];
    const newSolutionManual = {
      ...oldSolutionManual.chapters
    };
    Object.keys(newSolutionManual).forEach(item => {
      newSolutionManual[item].solutionManualId = solutionManual;
    });
    return newSolutionManual;
  });
  const chaptersCollection = solutionManualsArr.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (item[key].subchapters) {
        Object.keys(item[key].subchapters).forEach(subKey => {
          Object.keys(item[key].subchapters[subKey].exercises).forEach(
            exerKey => {
              item[key].subchapters[subKey].exercises[
                exerKey
              ].solutionManualId =
                item[key].solutionManualId;
              item[key].subchapters[subKey].exercises[exerKey].chapterId =
                item[key].id;
              item[key].subchapters[subKey].exercises[
                exerKey
              ].subchapterId = subKey;
              delete item[key].subchapters[subKey].exercises[exerKey].answers;
              acc.push({
                ...item[key].subchapters[subKey].exercises[exerKey]
              });
            }
          );
        });
      } else {
        Object.keys(item[key].exercises).forEach(exerKey => {
          item[key].exercises[exerKey].solutionManualId =
            item[key].solutionManualId;
          item[key].exercises[exerKey].chapterId = item[key].id;
          item[key].exercises[exerKey].subchapterId = null;
          delete item[key].exercises[exerKey].answers;
          acc.push({
            ...item[key].exercises[exerKey]
          });
        });
      }
    });
    return acc;
  }, []);
  return chaptersCollection;
}

export function createAnswersCollection(data) {
  const newObj = _.cloneDeep(data);
  const { solutionManuals } = newObj;
  const solutionManualsKeys = Object.keys(solutionManuals);
  const solutionManualsArr = solutionManualsKeys.map(solutionManual => {
    const oldSolutionManual = solutionManuals[solutionManual];
    const newSolutionManual = {
      ...oldSolutionManual.chapters
    };
    Object.keys(newSolutionManual).forEach(item => {
      newSolutionManual[item].solutionManualId = solutionManual;
    });
    return newSolutionManual;
  });
  const answersCollection = solutionManualsArr.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (item[key].subchapters) {
        Object.keys(item[key].subchapters).forEach(subKey => {
          Object.keys(item[key].subchapters[subKey].exercises).forEach(
            exerKey => {
              const answers =
                item[key].subchapters[subKey].exercises[exerKey].answers;
              if (answers) {
                Object.keys(answers).forEach(answKey => {
                  answers[answKey].solutionManualId =
                    item[key].solutionManualId;
                  answers[answKey].chapterId = item[key].id;
                  answers[answKey].subchapterId = subKey;
                  answers[answKey].exerciseId = exerKey;
                  answers[answKey].authorId = "JEToAR1VQySEaj2sY80FdbeoHWI2";
                  answers[answKey].createdAt = new Date(answers[answKey].date);
                  answers[answKey].isValidated = true;
                  delete answers[answKey].author;
                  delete answers[answKey].date;
                  delete answers[answKey].votes;
                  acc.push({
                    ...answers[answKey]
                  });
                });
              }
            }
          );
        });
      } else {
        Object.keys(item[key].exercises).forEach(exerKey => {
          const answers = item[key].exercises[exerKey].answers;
          if (answers) {
            Object.keys(answers).forEach(answKey => {
              answers[answKey].solutionManualId = item[key].solutionManualId;
              answers[answKey].chapterId = item[key].id;
              answers[answKey].subchapterId = null;
              answers[answKey].exerciseId = exerKey;
              answers[answKey].authorId = "JEToAR1VQySEaj2sY80FdbeoHWI2";
              answers[answKey].createdAt = new Date(answers[answKey].date);
              answers[answKey].isValidated = true;
              delete answers[answKey].author;
              delete answers[answKey].date;
              delete answers[answKey].votes;
              acc.push({
                ...answers[answKey]
              });
            });
          }
        });
      }
    });
    return acc;
  }, []);
  return answersCollection;
}
