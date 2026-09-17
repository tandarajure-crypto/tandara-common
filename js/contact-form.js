
(() => {
"use strict";

const params =
new URLSearchParams(window.location.search);

const success =
document.getElementById("form-success");

if (
success &&
params.get("sent") === "1"
) {
success.hidden = false;
}

})();
