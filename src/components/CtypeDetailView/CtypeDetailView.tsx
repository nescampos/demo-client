import * as React from 'react'
import { Link } from 'react-router-dom'

import { ICType } from '../../types/Ctype'
import Code from '../Code/Code'
import ContactPresentation from '../ContactPresentation/ContactPresentation'

import './CtypeDetailView.scss'
import CTypePresentation from '../CTypePresentation/CTypePresentation'

type Props = {
  cType?: ICType
}

const CtypeDetailView = ({ cType }: Props) => {
  return (
    <section className="CtypeDetailView">
      {cType ? (
        <React.Fragment>
          <div className="attributes">
            <div>
              <label>Title</label>
              <div>{cType.cType.metadata.title.default}</div>
            </div>
            <div>
              <label>Author</label>
              <div>
                <ContactPresentation address={cType.metaData.author} />
              </div>
            </div>
            <div>
              <label>Definition</label>
              <div>
                <Code>{cType.cType}</Code>
              </div>
            </div>
            <CTypePresentation cTypeHash={cType.cType.hash} size={50} />
          </div>
          <div className="actions">
            <Link to="/cType">Cancel</Link>
            <Link to={`/claim/new/${cType.cType.hash}`}>New Claim</Link>
          </div>
        </React.Fragment>
      ) : (
        <div>Given CTYPE key is not valid.</div>
      )}
    </section>
  )
}

export default CtypeDetailView
