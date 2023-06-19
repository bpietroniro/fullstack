```mermaid
sequenceDiagram
    participant browser
    participant server

		browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
		
		Note left of server: The server saves the new note. The browser also saves the note to its local storage.
		
		Note right of browser: The browser then re-draws the notes page using the data it has stored locally.
```
