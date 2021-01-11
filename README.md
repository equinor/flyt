VSM - Visual Stream Map
---

We heavily rely on canvas and use PixiJS to ease development.
We also use Redux + Redux-Saga for state management.

# Links
- [Figma design & prototype](https://www.figma.com/file/IkHwmIQrsT0iR34f5R5UnZ/VSM)

# Defining a process
A process consists of a set of entities.

An entity can be of the following types:
- MainActivity
- SubActivity
- Choice
- Waiting

Structure of an entity
```json5
{
  id: '',
  type: 'MainActivity',
  text: '',
  roles: [],
  duration: '',
  problems: [],
  ideas: [],
  solutions: [],
  parentId: ''
}
```

App can ask for all entities in a project.
API returns an array of all entities for the client to populate the view with.

``
[{entity},{entity},{entity}]
``

To update an entity

# API-Endpoints

## Project
Create Project
Read Project
Update Project
Delete Project

### Project object
```JSON5
{
  id: '',
  Entities: [] // [{entity},{entity},{entity}],
}
```

## Entity
### Create Entity
POST ``/entity``

body: 
```JSON5
{
  id: '',
  type: 'Main Activity',
  text: '',
  roles: [],
  duration: '',
  problems: [],
  ideas: [],
  solutions: [],
  parentId: ''
}
```

### Read Entity
GET ``/entity/{id}``

### Update Entity
PUT (or PATCH?) ``/entity/{id}``

### Delete Entity
DELETE ``/entity/{id}``
