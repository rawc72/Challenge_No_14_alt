const signupUsername = document.getElementById("signup-usernameInput");
const signupEmail = document.getElementById("signup-emailInput");
const signupPassword = document.getElementById("signup-passwordInput");
const loginUsername = document.getElementById("login-usernameInput");
const loginPassword = document.getElementById("login-passwordInput");
const createTitle = document.getElementById("createTitleInput");
const createContent = document.getElementById("createContentTextarea");
const editTitle = document.getElementById("editTitleInput");
const editContent = document.getElementById("editContentTextarea");
const commentContent = document.getElementById("commentContentTextarea");

const signupUsernameError = document.getElementById("error-username");
const signupEmailError = document.getElementById("error-email");
const signupPasswordError = document.getElementById("error-password");
const loginUsernameError = document.getElementById("error-login-username");
const loginPasswordError = document.getElementById("error-login-password");
const createTitleError = document.getElementById("error-create-title");
const createContentError = document.getElementById("error-create-content");
const editTitleError = document.getElementById("error-edit-title");
const editContentError = document.getElementById("error-edit-content");
const commentContentError = document.getElementById("error-comment-content");

const apiError = document.getElementById("signup-error-message");
const apiLoginError = document.getElementById("error-login-message");

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const signup = async () => {
  let isValid = true;
  if (signupUsername.value === "") {
    signupUsernameError.innerHTML = "Username can't be empty";
    isValid = false;
  }
  if (signupEmail.value === "") {
    signupEmailError.innerHTML = "Email address can't be empty";
    isValid = false;
  }
  if (signupPassword.value === "") {
    signupPasswordError.innerHTML = "Password can't be empty";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const data = {
    username: signupUsername.value,
    email: signupEmail.value,
    password: signupPassword.value,
  };

  // Call backend
  const response = await fetch("/api/users/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });

  const responseJson = await response.json();

  if (responseJson.status === "9") {
    apiError.innerHTML = "Something wrong while signing up...";
  } else if (responseJson.status === "8") {
    apiError.innerHTML = "Username or email already signed up...";
  } else {
    window.location.href = "/";
  }
};

const login = async () => {
  let isValid = true;
  if (loginUsername.value === "") {
    loginUsernameError.innerHTML = "Username can't be empty";
    isValid = false;
  }

  if (loginPassword.value === "") {
    loginPasswordError.innerHTML = "Password can't be empty";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const data = {
    username: loginUsername.value,
    password: loginPassword.value,
  };

  // Call backend
  const response = await fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });

  const responseJson = await response.json();

  if (responseJson.status === "9") {
    apiLoginError.innerHTML = "Something wrong while login...";
  } else {
    window.location.href = "/";
  }
};

const clearError = (fieldName) => {
  switch (fieldName) {
    case "signup-username":
      if (signupUsername.value !== "") {
        signupUsernameError.innerHTML = "";
      }
      break;
    case "signup-email":
      if (signupEmail.value !== "") {
        signupEmailError.innerHTML = "";
      }
      break;
    case "signup-password":
      if (signupPassword.value !== "") {
        signupPasswordError.innerHTML = "";
      }
      break;
    case "login-username":
      if (loginUsername.value !== "") {
        loginUsernameError.innerHTML = "";
      }
      break;
    case "login-password":
      if (loginPassword.value !== "") {
        loginPasswordError.innerHTML = "";
      }
      break;
    case "create-title":
      if (createTitle.value !== "") {
        createTitleError.innerHTML = "";
      }
      break;
    case "create-content":
      if (createContent.value !== "") {
        createContentError.innerHTML = "";
      }
      break;
    case "edit-title":
      if (editTitle.value !== "") {
        editTitleError.innerHTML = "";
      }
      break;
    case "edit-content":
      if (editContent.value !== "") {
        editContentError.innerHTML = "";
      }
      break;
    default:
  }
};

const updatePost = async (id) => {
  let isValid = true;
  if (editTitle.value === "") {
    editTitleError.innerHTML = "Title can't be empty";
    isValid = false;
  }

  if (editContent.value === "") {
    editContentError.innerHTML = "Content can't be empty";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Call backend
  const data = {
    title: editTitle.value,
    content: editContent.value,
  };

  const response = await fetch("/api/posts/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
    headers,
  });

  const responseJson = await response.json();

  if (responseJson.status === "9") {
    editContentError.innerHTML = "Something wrong...";
  } else {
    showToast("Post updated..");
    setTimeout(function () {
      window.location.href = "/dashboard";
    }, 2000);
  }
};

const deletePost = async (id) => {
  // Call backend
  const response = await fetch("/api/posts/" + id, {
    method: "DELETE",
    headers,
  });

  const responseJson = await response.json();

  if (responseJson.status === "9") {
    editContentError.innerHTML = "Something wrong...";
  } else {
    showToast("Post deleted..");
    setTimeout(function () {
      window.location.href = "/dashboard";
    }, 2000);
  }
};

const createPost = async () => {
  let isValid = true;
  if (createTitle.value === "") {
    createTitleError.innerHTML = "Title can't be empty";
    isValid = false;
  }

  if (createContent.value === "") {
    createContentError.innerHTML = "Content can't be empty";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Call backend
  const data = {
    title: createTitle.value,
    content: createContent.value,
  };

  const response = await fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });

  const responseJson = await response.json();

  if (responseJson.status === "9") {
    createContentError.innerHTML = "Something wrong...";
  } else {
    showToast("Post created..");
    setTimeout(function () {
      window.location.href = "/dashboard";
    }, 2000);
  }
};

const commentPost = async (postid) => {
  let isValid = true;

  if (commentContent.value === "") {
    commentContentError.innerHTML = "Comment content can't be empty";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Call backend
  const data = {
    postid: postid,
    content: commentContent.value,
  };

  const response = await fetch("/api/posts/" + postid + "/comments", {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });

  const responseJson = await response.json();

  if (responseJson.status === "9") {
    commentContentError.innerHTML = "Something wrong...";
  } else {
    showToast("Comment created..");
    setTimeout(function () {
      window.location.href = "/";
    }, 2000);
  }
};

const redirect = (url) => {
  window.location.href = url;
};

const showToast = (message) => {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
  x.innerHTML = message;

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 2000);
};
