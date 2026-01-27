focus on /app
it is mobile first app
so ony focus on mobile viewport

a navigational menu at the bottom of the screen

5 buttons in the menu
dashboard
workouts

- button(drawer opens to start new workout or log weight or log diet)
  logs(calories)
  account with about

it components needed:

1. Home Page
2. workout Page
3. logs Page(diet / weight as tabs)
4. new workout / log weight / log diet (drawer)
5. account with about page

Home Page:

- Overview of today stats
  - overall calories burned
  - total workout time
  - progress towards goals
    as concentric circles legends to side
- weekly summary graph
  - calories burned over the week
  - workout duration over the week
  - total workouts completed
- Quick access to start a new workout
- Recent activity feed

workout Page:

- assume a training plan is already set up (use const json data defined in frontend)
- top bar with current day and date and like leg day 1, day 2 ..., shoulder day 1 ....
- list of scheduled workouts for the day as like cards
- bottom button to start today's workout with timer and exercise list button
- each workout card shows
  - workout name
  - duration,repetitions,weights(check db-guide)
  - calories to be burned
- exercise list button shows list of exercises in the workout with details
- swipe to mark workout as complete or skip

logs Page:

- two tabs at the top: Diet and Weight
- Diet Tab:
  - daily calorie intake log
  - meal breakdown (breakfast, lunch, dinner, snacks)
  - option to add new meal entry
  - weekly calorie intake graph
- Weight Tab:
  - weight log over time graph
  - option to add new weight entry
  - target weight and progress indicator

drawer (opens from + button in nav menu):

- three options: - Start New Workout (redirects to workout page) - Log Weight (opens weight log form) - Log Diet (opens diet log form)
  note : forms implementation not needed

Account Page:

- User profile information (name, email, profile picture)
- Settings options (notification preferences)
- About section with gym information (refer to gym-details.md)
- Logout button

implementation flow :

1. Set up the mobile-first layout with a bottom navigation menu.
2. Create the Home Page with stats overview, weekly summary graph, quick access button, and recent activity feed.
3. Develop the Workout Page with scheduled workouts, start workout button, and exercise list functionality.
4. Build the Logs Page with Diet and Weight tabs, including log entries and graphs.
5. Implement the drawer functionality for starting new workouts and logging weight/diet.
6. Create the Account Page with user profile, settings, about section, and logout button.
7. Ensure smooth navigation between all pages and components.

waiting for confirmation to proceed with implementation.
