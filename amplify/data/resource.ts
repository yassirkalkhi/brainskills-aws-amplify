import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { addUserToGroup } from "./add-user-to-group/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  student : a
    .model({
      studentId : a.id().required(),
      fullName: a.string().required(),
      email: a.string().required(),
      groupCode: a.string(),
      phone: a.string(),
      status: a.enum(["active", "suspended", "inactive"]),
      registration: a.date(),
      createdAt: a.date().default(),
    })
    .identifier(["studentId"]),
  professor : a
      .model({
        professorId : a.id().required(),
        fullName: a.string(),
        email: a.string(),
        phone: a.string(),
        status: a.enum(["active", "suspende", "inactive"]),
       })
      .identifier(["professorId"]),
  officeManager : a
      .model({
        officeManagerId : a.id().required(),
        fullName: a.string(),
        email: a.string(),
        phone: a.string(),
        status: a.enum(["active", "suspende", "inactive"]),
       })
      .identifier(["officeManagerId"]),
  subject : a
      .model({
        subjectId : a.id().required(),
        name: a.string(),
        type: a.string(),
        })
      .identifier(["subjectId"]),
  enrollment : a
      .model({
        enrollmentId : a.id().required(),
        status: a.enum(["active", "suspended", "inactive"]),
        createdAt: a.date().default(),
        studentId : a.id().required(),
        subjectId : a.id().required(),
        professorId : a.id().required(),
        officeManagerId : a.id().required(),
        student : a.belongsTo("student", "studentId"),
        subject : a.belongsTo("subject", "subjectId"),
        professor : a.belongsTo("professor", "professorId"),
        officeManager : a.belongsTo("officeManager", "officeManagerId"),
        })
      .identifier(["enrollmentId"]),
  professorPayment : a
      .model({
        paymentId : a.id().required(),
        paymentDate: a.date(),
        amount: a.float(),
        month: a.integer(),
        createdAt: a.date().default(),
        professorId : a.id().required(),
        professor : a.belongsTo("professor", "professorId"),
        officeManagerId : a.id().required(),
        officeManager : a.belongsTo("officeManager", "officeManagerId"),
        })
      .identifier(["paymentId"]),
  studentPayment : a
      .model({
        paymentId : a.id().required(),
        paymentDate: a.date(),
        amount: a.float(),
        type: a.enum(["mensuelle", "inscription", "autre"]),
        month: a.integer(),
        createdAt: a.date().default(),
        enrollmentId : a.id().required(),
        enrollment : a.belongsTo("enrollment", "enrollmentId"),
        officeManagerId : a.id().required(),
        officeManager : a.belongsTo("officeManager", "officeManagerId"),
        })
      .identifier(["paymentId"]),
  bankOperation : a
      .model({
        operationId : a.id().required(),
        amount: a.float(),
        type: a.enum(["cheque", "verssment", "virement"]),
        description: a.string(),
        createdAt: a.date().default(),
        officeManagerId : a.id().required(),
        officeManager : a.belongsTo("officeManager", "officeManagerId"),
        })
      .identifier(["operationId"]),
  charges : a
      .model({
        chargeId : a.id().required(),
        amount: a.float().required(),
        description: a.string().required(),
        createdAt: a.date().default(),
        officeManagerId : a.id().required(),
        officeManager : a.belongsTo("officeManager", "officeManagerId"),
        })
      .identifier(["chargeId"]),
  cashierOperation : a
      .model({
        operationId : a.id().required(),
        amount: a.float(),
        flux: a.enum(["INCOME", "EXPENSE"]),
        description: a.string(),
        createdAt: a.date().default(),
        officeManagerId : a.id().required(),
        officeManager : a.belongsTo("officeManager", "officeManagerId"),
        })
      .identifier(["operationId"]),
  tuitionPayments : a
      .model({
        tuitionPaymentId : a.id().required(),
        amount: a.float().required(),
        dueDate: a.date().required(),
        reason  : a.string(),
        createdAt: a.date().default(),
        officeManagerId : a.id().required(),
        officeManager : a.belongsTo("officeManager", "officeManagerId"),
      })
      .identifier(["tuitionPaymentId"]),

  addUserToGroup: a
    .mutation()
    .arguments({
      userId: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(addUserToGroup))
    .returns(a.json())


});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
