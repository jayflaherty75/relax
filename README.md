# Relax
----
A simple and familiar container definition for React/Redux components.

## Benefits of Relax:
---
* No more smart components vs. dumb components.  Relax extends React Component to provide a defined Container.
* Just write Container methods.  Relax detects and maps action implementations and manages actions, action constants, reducers, etc. for you.
* If you have two instances of the same component, how does the Redux reducer know which instance it is dealing with?  Actions and reducers are unique to a Relax container instance so you can create multiple instances with each having their own actions and action implementations.
* Containers are initialized (wired into the application) or uninitialized whenever you feel necessary.  Initialize in constructor, componentWillMount or even externally, you can keep your application free of unnecessary action/reducer clutter.
* Default behaviors are provided and Relax will intelligently structure actions but Relax also provides ways to override these behaviors and conventions so you can still integrate with other libraries.
* All custom methods defined in the container are mapped to props automatically and you can still add other action dispatchers when necessary.
