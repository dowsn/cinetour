## Cinetour

Cinetour is a new way how to experience and explore culture in your town.

- One platform brings a subscription card for unlimited access to your favorite venues.
- You can browse daily updated programme of those venues based on your criteria.
- You can meet with other users (cinetourists) and watch movies together by joining Tours.
- Are you a cinema operator? This platform makes sure your audience stays engaged with your programme(cinema network) and interacts with you and other movie fans. You are no longer the only one creating events. Let's make culture cool, open, accessible and social again!

## Video Walktrough

<a href="https://www.youtube.com/watch?v=8A8Q27UnYv4" target="_blank"><img src="/public/youtube.png" align="center" width="600" ></a>

# How does it work

## User

### Registration and Profile

- Click on the profile icon in upper right corner of the Header.
- Register and login as a user with your real or fictional data.
- In you profile you can see a map of cinetour network, change your data or profile picture (WILL BE ADDED IN NEXT VERSION), see a list of my friends and tours you are hosting or attending.

### Subscription

- Subscribe for your yearly CineTour Card
- Click on Subscripition button - type in this test credit card (4242 4242 4242.4242) and submit your payment. Optionally you can also try using (4000000000000002).
- You have been checked if you are logged in and if you have proper checkout. session token (which wasn't used before).
- In your Profile you can see now Subscription Expiration Time and QR code you can use to access cinemas before receiving your own CineTour Card.

### Cinemas

- Click to Cinemas in a Header to access programme of all cinemas within CineTour Network (Note: the programme is daily updated, so if you don't see it, read below how to create a new programme for following days).
- Try filtering the programme via selecting days, cinemas, typing in titles or showing only English Friendly screenings.
- You can also access tours and film profiles by clicking on links under the screening.

### Tours

- Tours are spontaneous get togethers created by other cinetourists that like to watch films together with others with friends or just meet new people.
- Accessing Tours - Tours are accessible on the homepage, in Cinemas under showing times, in Tours, in Films and in all profiles of cinetourist.
- Creat Tour - You can create Tour on any page with displayed programme by pressing + button under Tours. Add a message for other potential cinetourists joining your Tour (where and when do you meet, how they recognize you, what do you do before and after the movie).
- Editing Tours - Click Edit under Tours you have created.
- Joining Tours - Click Join under any tour organized by other cinetourist.
- Leaving Tours - Click Leave under Tour you've joined.

### Friends

You can add any CineTourist to your friendlist by clicking Add Friend on top of his/her profile. You can also delete friend on the same place. Under Tours you can then filter Friends - seeing only those tours that are hosted or attended by your friends.

## Films and Cinetourist

Another way how to approach the platform is to click on the sandwich menu in the Header and Browse through Films or Cinetourists, seeing screening times and tours under their respective profiles.

### Newsletter

In Footer you can apply for receiving newsletter by putting your e-mail address.

### Responsive

The whole platform is fully responsive and works on various screens.

## Admin (cinema manager)

- Admin is the only cinetourist that can manage database of films and programmes.
- Login as admin (username: admin, password: comics)
- Go to your profile and try to add, delete and edit films and programmes under your Admin Tools tab.
- You can also select (only one) Film of the week which will be displayed on the homepage. After doing so, don't forget to change the Image, also under Edit Films.
  (WILL BE ADDED IN NEXT VERSION)

### Security

All content you see is manageable via number of APIs communicating with Postgres databases. All those are secured by session token or csrf token used for cross site request forgery prevention.

# Inspiration

- Niederoesterreinch-CARD
- Kino Karte Wien (in making)
- Cineville (Netherlands)

# Ideas for future

- Adding more than one tour to a screening
- Bookmarking films of which programme user wants to follow
- sharing photos from cinemas publicly or on your profile
- rating system for users and films
- Implementing MeetUp, Facebook Events, IG, tik tok
- Dividing tours to public and private
- Messages (personal and within tours)
- subscription also for shorter time and possibility to cancel
- request friendship
- when not subscriber - possibility to buy single tickets for screenings
- mail check after registration and 2-factor verification
- Cinetourist's reviews within film profiles
- Filmquizes and other interactive elements
- Displaying your address and cinemas close to you
- ticket portal for nonusers
- cinema reviews
- allow admin to add new cinemas that just joined the network
- dark mode
- filtering by genre and setting favorite genres in your profile
- posters and profile pictures under cinetourists and films
- naming tours and sorting them
- history of tours films visited in a profile, TOP 10 favorite movies visited and ability to see who shares them too, my favorite cinema etc.
- adding festival features and special events

# Tech Stack

## Technologies used

- Next.js
- React
- Postgres
- TypeScript/JavaScript
- Node.js

## External APIs

- Google Maps
- Mailchimp
- Stripe
- Cloudinary

## Styling

- Emotion
- Figma
