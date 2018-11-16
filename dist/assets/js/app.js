function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Har',
  lastName: 'ez'
};
const element = React.createElement("h1", null, "Hello, ", formatName(user), "!");
ReactDOM.render(element, document.getElementById('reactTest'));
