
import { Router, useRouter } from 'preact-router'
import { createHashHistory} from 'history'

import routing from '../routing'

export function OurRouter(props) {
    const { children, ...rest } = props
    return <Router history={createHashHistory()} {...rest}>
        {children}
    </Router>
}

export function withRouter(TheComponent) {
    return function(props) {
        const router = useRouter()[0]
        return <OurRouter>
            {Object.entries(routing).map(pair => {
                const [k, v] = pair
                return <TheComponent path={v} router={router} key={v} path={v} {...props} />
            })}
        </OurRouter>
    }
}