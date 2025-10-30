import Express from 'express'
import path from 'path';
import pagesRoutes from './src/routes/pages.routes.js';
import moviesRoutes from './src/routes/movies.routes.js';
import showsRoutes from './src/routes/shows.routes.js';
import actorsRoutes from './src/routes/actors.routes.js';
import movieDetailsRoutes from './src/routes/movie-details.routes.js';
import episodeDetailsRoutes from './src/routes/episode-details.routes.js'
import showDetailsRoutes from './src/routes/show-details.routes.js';
import actorDetailsRoutes from './src/routes/actor-details.routes.js'
import { fileURLToPath } from 'url';

const app = Express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(Express.static(path.join(__dirname, 'public')));
app.use(Express.urlencoded({ extended: true }));

app.use('/', pagesRoutes);
app.use('/movies', moviesRoutes);
app.use('/shows', showsRoutes);
app.use('/actors', actorsRoutes);
app.use('/movie-details', movieDetailsRoutes);
app.use('/show-details', showDetailsRoutes);
app.use('/show', episodeDetailsRoutes);
app.use('/actor-details', actorDetailsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});