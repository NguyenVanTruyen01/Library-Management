import routerAuth from './AuthRouters'
import CategoryRouters from './CategoryRouters'
import BookRouters from './BookRouters'
import CallCardRouters from './CallCardRouters'
import Statistical from './StatisticalRouter'
import RuleRouters from './RuleRouters'


const indexRoutes = [
    routerAuth,
    CategoryRouters,
    BookRouters,
    CallCardRouters,
    Statistical,
    RuleRouters
]

export default indexRoutes