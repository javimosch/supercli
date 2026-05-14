/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Add fields to categories collection
  const categories = app.findCollectionByNameOrId("categories");

  const nameField = new TextField({
    "name": "name",
    "required": true,
    "presentable": true
  });
  categories.fields.push(nameField);

  const colorField = new TextField({
    "name": "color",
    "required": false,
    "presentable": false
  });
  categories.fields.push(colorField);

  app.save(categories);

  // Add fields to todos collection  
  const todos = app.findCollectionByNameOrId("todos");

  const titleField = new TextField({
    "name": "title",
    "required": true,
    "presentable": true
  });
  todos.fields.push(titleField);

  const descriptionField = new TextField({
    "name": "description",
    "required": false,
    "presentable": false
  });
  todos.fields.push(descriptionField);

  const completedField = new BoolField({
    "name": "completed",
    "default": false,
    "presentable": true
  });
  todos.fields.push(completedField);

  const priorityField = new SelectField({
    "name": "priority",
    "values": ["low", "medium", "high"],
    "default": "medium",
    "presentable": true
  });
  todos.fields.push(priorityField);

  const dueDateField = new DateField({
    "name": "due_date",
    "required": false,
    "presentable": true
  });
  todos.fields.push(dueDateField);

  const categoryField = new RelationField({
    "name": "category",
    "collectionId": categories.id,
    "maxSelect": 1,
    "minSelect": 0,
    "presentable": true
  });
  todos.fields.push(categoryField);

  app.save(todos);
}, (app) => {
  // Revert changes - delete and recreate collections
  const categories = app.findCollectionByNameOrId("categories");
  app.delete(categories);

  const todos = app.findCollectionByNameOrId("todos");
  app.delete(todos);
})