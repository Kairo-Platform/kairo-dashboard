import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
input,
button {
  padding: 0;
  margin: 0;
}

* {
  box-sizing: border-box;
}

body {
  overflow: overlay;
  scroll-behavior: smooth;
  font-family: var(--font-satoshi), Satoshi, Arial, sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-dm-sans), "DM Sans", sans-serif;
}

input, textarea, button {
  font-family: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  border: 0;
  background-color: transparent;
}

ul {
  padding: 0;
  margin: 0 0 0 1.1rem;
  list-style-type: disc;
  list-style-position: outside;
}

table {
  width: 100%;
}

details > summary::marker,
details > summary::-webkit-details-marker {
  display: none;
}

.link {
  color: ${(props) => props.theme.colors.primaryColor};

  &:focus,
  &:hover {
    text-decoration: underline;
    transition: 0.3s;
    cursor: pointer;
  }
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb:hover,
:hover ::-webkit-scrollbar-thumb {
  background-color: ${(props) => props.theme.colors.primaryColor};
}

.color-red {
  color: ${(props) => props.theme.colors.red};
}
.color-green {
  color: ${(props) => props.theme.colors.green};
}
.color-primary {
  color: ${(props) => props.theme.colors.primaryColor};
}

.text-align-center {
  text-align: center;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.font-weight-medium {
  font-weight: 500;
}
.font-weight-bold {
  font-weight: 700;
}

.font-size-xxs {
  font-size: xx-small;
}
.font-size-xs {
  font-size: x-small;
}
.font-size-sm {
  font-size: small;
}
.font-size-lg {
  font-size: large;
}
.font-size-xl {
  font-size: x-large;
}
.font-size-xxl {
  font-size: xx-large;
}

.p-relative {
  position: relative;
}

.p-absolute {
  position: absolute;
}
`;
