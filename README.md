# Proximi.io AR

## Installation

Install with npm

```bash
npm install proximiio-ar
```

## Usage

import into project with

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
