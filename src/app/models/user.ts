import { Todo } from "./todo"

export interface User {
    uid: string
    email: string
    todos: Todo[]
}