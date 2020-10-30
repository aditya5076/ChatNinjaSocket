const users = [];

function joinUsers(id, username, room) {
  const user = { id, username, room }; //crated a specific user to push into users array

  users.push(user);

  return user;
}

// to get the curr user from the list arrays(users)
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}
// when users leave
function getUserWhoLeave(id) {
  const index = users.findIndex((user) => user.id === id); //to get the index by giving the id
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  joinUsers,
  getCurrentUser,
  getUserWhoLeave,
  getRoomUsers,
};
