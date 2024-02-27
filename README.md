# Proximi.io AR

## Getting work

In case of cloning the repo from GitHub please run `npm install` afterwards.

### Using just in browser

This requires to load js file into script tag of html file.

```javascript
<script src='lib/proximiio-ar.js'></script>
```

### Using in node.js

```javascript
const ProximiioAR = require('lib/index').default;
```

### Using with modern javascript frameworks (Angular, React)

Install with npm

```bash
npm install proximiio-ar
```

and then import into project with

```javascript
import { ARButton, ARSession } from 'proximiio-ar';

ARButton.createButton({
	immersalToken: 'immersal-token',
	immersalMapId: 94486,
});

// or

ARSession.start({
	immersalToken: 'immersal-token',
	immersalMapId: 94486,
});
```
