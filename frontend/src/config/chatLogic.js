// export const getSender = (loggedUser, users) => {
//   return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
// };

// for selected user
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const getSender = (loggedUser, users) => {
  if (!users || users.length === 0) return "Unknown User"; // ✅ Avoids undefined error

  return users[0]._id === loggedUser._id
    ? users[1]?.name || "Unknown User"
    : users[0]?.name || "Unknown User";
};
