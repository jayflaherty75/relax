# Relax for react-redux
A straighforward container definition for React components using react-redux.  Just write the reducer as a container method and Relax does the rest.
----

## Benefits of Relax:
* Handles all the "wiring" of react and redux.  See Todos refactor under /examples.
* Multiple instances of the same Container class are handled by Relax.  Reducers are simply binded to 'this' for each instance.
* Containers are initialized (wired into the application) or uninitialized whenever you feel necessary.  Initialize in constructor, componentWillMount or even externally, you can keep your application free of unnecessary action/reducer clutter.
* Still the same wiring under the hood so you can combine with old code or integrate with existing libraries/modules.

