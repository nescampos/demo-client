import React from 'react'
import { connect } from 'react-redux'

import ClaimListView from '../../components/ClaimListView/ClaimListView'
import * as Claims from '../../state/ducks/Claims'
import { RouteComponentProps } from 'react-router'
import ClaimDetailView from 'src/components/ClaimDetailView/ClaimDetailView'

type Props = RouteComponentProps<{ id: string }> & {
  claims: Claims.Entry[]
  removeClaim: (id: string) => void
}

type State = {}

class ClaimView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.deleteClaim = this.deleteClaim.bind(this)
  }

  public render() {
    const { id } = this.props.match.params
    let currentClaim
    if (id) {
      currentClaim = this.getCurrentClaim()
    }
    return (
      <section className="ClaimView">
        {!!id && (
          <ClaimDetailView
            claim={currentClaim}
            removeClaim={this.deleteClaim}
          />
        )}
        {!id && <ClaimListView claims={this.props.claims} />}
      </section>
    )
  }

  private getCurrentClaim(): Claims.Entry | undefined {
    return this.props.claims.find(
      (claim: Claims.Entry) => claim.id === this.props.match.params.id
    )
  }

  private deleteClaim(id: string) {
    const { removeClaim } = this.props
    removeClaim(id)
    this.props.history.push('/claim')
  }
}

const mapStateToProps = (state: { claims: Claims.ImmutableState }) => {
  return {
    claims: state.claims
      .get('claims')
      .toList()
      .toArray(),
  }
}

const mapDispatchToProps = (dispatch: (action: Claims.Action) => void) => {
  return {
    removeClaim: (id: string) => {
      dispatch(Claims.Store.removeAction(id))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimView)
