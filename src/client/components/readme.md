# EyeVocab
## p2 - Instructor Interface
### `src/client/components`

The modules for the Creator UX

**Vocab Creation Modules**

* [`VocabViewer`](./creator/vocab.viewer.tsx)
  * allows the creator user (`ICreator`) to view vocabulary items
* [`VocabCreator`](./creator/vocab.creator)
  * allows the creator user (`ICreator`) to create vocabulary items
* [`VocabEditor`](./creator/vocab.editor.tsx)
  * allows the creator user (`ICreator`) to edit vocabulary items

**Collection Creation Modules**

* [`CollectionViewer`](./creator/collection.viewer.tsx)
  * allows the creator user (`ICreator`) to view collection items
* [`CollectionCreator`](./creator/collection.creator)
  * allows the creator user (`ICreator`) to create collections, prompts the user if they would like to add items
* [`CollectionEditor`](./creator/collection.editor.tsx)
  * allows the creator user (`ICreator`) to edit collections, and add or remove vocab items