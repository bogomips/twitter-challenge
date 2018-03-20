import * as Router from 'koa-router';
import config from 'config';

/*import your controllers*/
import root_get  from 'controllers/root_get';
import search_get from 'controllers/search_get';
import twitter_twitts_id_get from 'controllers/twitter_twitts_id_get';

const router = new Router();

router.prefix(config.api.prefix)

/*Your routes*/
router.get('/', root_get);
router.get('/search', search_get);
router.get('/twitter/tweets/:id', twitter_twitts_id_get);

export const routes = router;