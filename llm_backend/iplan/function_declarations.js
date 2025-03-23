const { FunctionDeclarationSchemaType } = require("@google-cloud/vertexai");

const functionDeclarations = [{
  function_declarations: [
    {
      name: "createEvent",
      description: "create a new event in the calendar for the user",
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
            title: {
              type: FunctionDeclarationSchemaType.STRING,
              "description":
                "title of the event"
            },
            description: {
              type: FunctionDeclarationSchemaType.STRING,
              "description":
                "description of the event"
            },
            startTime: {
              type: FunctionDeclarationSchemaType.STRING,
              "description":
                "starting time of the event in ISO 8601 format"
            },
            endTime: {
              type: FunctionDeclarationSchemaType.STRING,
              "description":
                "ending time of the event in ISO 8601 format"
            }
        },
        required: ["title", "description", "startTime", "endTime"]
      }
    },

    {
      name: "modifyEvent",
      description: "modify an existing event in the calendar for the user",
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          eventId: {
            type: FunctionDeclarationSchemaType.STRING,
            "description":
              "an unique identifier of the event to be modified"
          },
          title: {
            type: FunctionDeclarationSchemaType.STRING,
            "description":
              "updated title of the event"
          },
          description: {
            type: FunctionDeclarationSchemaType.STRING,
            "description":
              "updated description of the event"
          },
          startTime: {
            type: FunctionDeclarationSchemaType.STRING,
            "description":
              "updated starting time of the event in ISO 8601 format"
          },
          endTime: {
            type: FunctionDeclarationSchemaType.STRING,
            "description":
              "updated ending time of the event in ISO 8601 format"
          }
        }
      }
    },

    {
      name: "deleteEvent",
      description: "delete an existing event in the calendar for the user",
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          eventId: {
            type: FunctionDeclarationSchemaType.STRING,
            "description":
              "an unique identifier of the event to be deleted"
          }
        }
      }
    },
  ]
}];

module.exports = functionDeclarations;
