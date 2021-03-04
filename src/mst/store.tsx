import { types } from "mobx-state-tree"

/*
 * The models that will be the reference of the instances of the tree must be build here
 * Example:
 * const User = types
 *   .model({
 *      name: types.optional(types.string, ""),
 *      role: types.optional(types.string, ""),
 *   })
 *   .actions(self => ({
 *      setName(newName) {
 *        self.name = newName
 *      }
 *    }))
 */

const RootStore = types.model({
  //  Here goes the states that uses the previous models to build the tree
})

const store = RootStore.create({
  //  Initial the state goes here
})

export default store
