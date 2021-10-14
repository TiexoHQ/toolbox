import { injectGlobal } from '@emotion/css'

injectGlobal`
  html, body {
	height: 100%;
	width: 100%;
	padding: 0;
	margin: 0;
	background: #292a31;
	font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
	font-weight: 400;
	color: #444;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

* {
	box-sizing: border-box;
}

#app {
	height: 100%;
}
`
