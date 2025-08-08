This is my GitHub pages live link:
https://lauren-0222.github.io/Project-1/

I had to create a whole new repository since my last submission. I had to delete my live link for my old repository. I thought that a new link would generate, but it did not. You will probably see only an initial or minimal commits and that is why.

### Development Process and Project Reflection
The development of the URL Shortening API landing page was an insightful journey, primarily focused on front-end development, API integration, and user experience. The process began with structuring the HTML to form the basic layout, followed by styling with CSS to ensure a responsive design across various devices. I'm still struggling with the design portion.JavaScript was then used to implement the core functionality, including form handling, API calls, and dynamic rendering of the shortened links. I chose to use the native fetch API for making network requests, which felt appropriate for the project's scope.

### Challenges and Solutions
One of the main challenges was handling the API integration. The Bitly API requires an access token and specific headers, and handling potential errors from the API (like an invalid URL or a network issue). I implemented a try...catch block around the fetch call to manage these exceptions, providing clear and user-friendly error messages to the user. Another challenge was managing the state of the shortened links.

### Potential Improvements
Looking back, there are several areas for improvement. While the current solution stores links in local storage, a more robust solution would involve a simple backend to persist user links in a database, allowing users to access them from different devices. I'd also like to enhance the accessibility of the application. For instance, I'd improve the focus states for keyboard navigation and ensure all interactive elements have proper ARIA attributes. Additionally, the project could benefit from a better styled layout design. 