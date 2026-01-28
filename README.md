# Taskman
Full stack app for managing tasks inspired by trello. Based on Angular for client SPA and Laravel for backend API.

## Setting up development environment
1. Clone the repository

    `$ git clone https://github.com/milinkovicmilos/taskman.git`

2. Navigate to server directory

    `$ cd taskman/server`

3. Install required packages

    `$ composer install`

4. Copy the environment file

    `$ cp .env.example .env`

5. Edit environment file

    By default taskman is setup to be used with Laravel Sail - dockerized development environment.

    Make sure:
      - Database connection settings are valid
      - To set SESSION_DOMAIN environment variable for Laravel Sanctum to work
      - To set SANCTUM_STATEFUL_DOMAINS

6. Start local development server

   `$ php artisan serve`

   Make sure MySQL database server is running 

   Or if you are using Laravel Sail:

   `$ ./vendor/bin/sail up -d`

7. Generate new app key

   `$ php artisan key:generate`
   
   Or if you are using Laravel Sail:
   
   `$ ./vendor/bin/sail artisan key:generate`

8. Run database migrations

   `$ php artisan migrate:fresh`

   Or if you are using Laravel Sail:

   `$ ./vendor/bin/sail artisan migrate:fresh`

9. Run database seeders

   `$ php artisan db:seed`

   Or if you are using Laravel Sail:

   `$ ./vendor/bin/sail artisan db:seed`

10. Navigate to client directory

    `$ cd ../client`

11. Install required packages

    `$ npm install`

12. Start Angular development server
    
    If you have angular cli installed globally:
    
    `$ ng serve`
    
    If you want to use locally installed angular cli (Recommended):
    
    `$ npx ng serve`

You are done! You are ready to head over to Angular development server address (default: `http://localhost:4200`)!
