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

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      (messages[i + 1].sender._id === undefined &&
        messages[i].sender._id !== userId))
  );
};

// export const lastMessage = (messages, i, userId) => {
//   return (
//     i < messages.length - 1 &&
//     messages[messages.length - 1].sender._id !== userId &&
//     messages[messages.length - 1].sender._id
//   );
// };

export const lastMessage = (messages, i, userId) => {
  return i === messages.length - 1 && messages[i].sender._id !== userId; // ✅ Correctly checks if it's the last message in the array
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return "ml-10";
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return "ml-0";
  else return "ml-auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
