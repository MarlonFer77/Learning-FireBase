import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, mergeMap, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Todo } from 'src/app/models/todo';
import { User } from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private usersCollection = this.store.collection<User>('users')
  private currentUser = this.authService.currentUser

  constructor(
    private store: AngularFirestore,
    private authService: AuthService
  ) { }

getTodos(): Observable<Todo[]> {
  return this.currentUser.pipe(
    mergeMap(user => {
      return this.usersCollection.doc(user?.uid).get()
    }),
    map(userDoc => {
      return userDoc.data()?.todos || []
    })    
  )
}

createTodo(todo: Todo) {
    return this.currentUser.pipe(
      mergeMap(user => {
        return this.usersCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        // a função data retorna um objeto com os dados do documento 
        // do firebase
        const user = userDoc.data() as User
        
        todo.id = this.store.createId()

        user.todos.push(todo)

        // a função update serve para atualizar os dados de um documento no firebase
        return userDoc.ref.update(user)
      })
    )
  }

deleteTodo(todo: Todo) {
    return this.currentUser.pipe(
      mergeMap(user => {
        return this.usersCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        // a função data retorna um objeto com os dados do documento 
        // do firebase
        const user = userDoc.data() as User

        user.todos = user.todos.filter(t => {
          return t.id != todo.id
        })

        // a função update serve para atualizar os dados de um documento no firebase
        return userDoc.ref.update(user)
      })
    )
  }

updateTodo(todo: Todo ) {
    return this.currentUser.pipe(
      mergeMap(user => {
        return this.usersCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        // a função data retorna um objeto com os dados do documento 
        // do firebase
        const user = userDoc.data() as User

        user.todos = user.todos.map(t => {
          if (t.id == todo.id) {
            return todo
          } else {
            return t
          }
        })

        // a função update serve para atualizar os dados de um documento no firebase
        return userDoc.ref.update(user)
      })
    )
  }  
}
