import Express from 'express'
import path from 'path';
import pagesRoutes from './src/routes/pages.routes.js';
import moviesRoutes from './src/routes/movies.routes.js';
import showsRoutes from './src/routes/shows.routes.js';
import actorsRoutes from './src/routes/actors.routes.js'
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
