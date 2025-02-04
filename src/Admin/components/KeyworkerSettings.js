import React from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import '../index.scss'
import MessageBar from '../../MessageBar/index'
import ValidationErrors from '../../ValidationError'
import { userType } from '../../types'

const KeyworkerSettings = (props) => {
  const {
    capacity,
    supported,
    sequenceFrequency,
    handleSequenceFrequency,
    allowAuto,
    handleAllowAutoChange,
    validationErrors,
    handleCapacityChange,
    extCapacity,
    handleExtCapacityChange,
    handleUpdate,
    history,
    user,
  } = props
  const buttonText = supported ? 'Save settings' : 'Save settings and migrate'
  const statusText = supported ? 'Enabled' : 'Not yet enabled'
  const sequenceFrequencyString = sequenceFrequency && sequenceFrequency.toString()
  const frequencySelect = (
    <select
      id="frequency-select"
      name="frequency-select"
      className="form-control sequenceFrequency"
      value={sequenceFrequencyString}
      onChange={handleSequenceFrequency}
    >
      <option id="option_once_a_week" key="1" value="1">
        Once a week
      </option>
      <option id="option_once_a_fortnight" key="2" value="2">
        Once a fortnight
      </option>
    </select>
  )

  const caseLoadOption = user.caseLoadOptions
    ? user.caseLoadOptions.find((option) => option.caseLoadId === user.activeCaseLoadId)
    : undefined
  const caseLoadDesc = caseLoadOption ? caseLoadOption.description : user.activeCaseLoadId

  return (
    <div>
      <MessageBar {...props} />
      <div className="pure-g">
        <div className="pure-u-md-12-12 padding-top">
          <div className="pure-u-md-2-12">
            <div className="bold">Prison</div>
          </div>
          <div className="pure-u-md-7-12">
            <div>{caseLoadDesc}</div>
          </div>
        </div>
        <div className="pure-u-md-12-12 padding-top">
          <div className="pure-u-md-2-12">
            <div className="bold">Status</div>
          </div>
          <div className="pure-u-md-7-12" id="status">
            <div>{statusText}</div>
          </div>
          <hr />
        </div>

        <div className="pure-u-md-12-12 padding-top">
          <fieldset className="inline">
            <div className="pure-u-md-2-12">Allow auto-allocation</div>
            <div className="pure-u-md-4-12">
              <div className="multiple-choice">
                <input
                  id="allowAutoYes"
                  name="allowAutoYes"
                  type="radio"
                  value="true"
                  checked={allowAuto}
                  onClick={handleAllowAutoChange}
                />
                <label htmlFor="allowAutoYes">Yes</label>
              </div>
              <div className="multiple-choice">
                <input
                  id="allowAutoNo"
                  name="allowAutoNo"
                  type="radio"
                  value="false"
                  checked={!allowAuto}
                  onClick={handleAllowAutoChange}
                />
                <label htmlFor="allowAutoNo">No</label>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="pure-u-md-12-12 padding-top">
          <div className="pure-u-md-2-12">Capacity Tier 1</div>
          <div className="pure-u-md-7-12">
            <ValidationErrors validationErrors={validationErrors} fieldName="capacity" />
            <input
              type="text"
              maxLength="4"
              className="form-control capacityInput"
              id="capacity"
              name="capacity"
              value={capacity}
              onChange={handleCapacityChange}
            />
          </div>
        </div>

        <div className="pure-u-md-12-12 padding-top">
          <div className="pure-u-md-2-12">Capacity Tier 2</div>
          <div className="pure-u-md-7-12">
            <ValidationErrors validationErrors={validationErrors} fieldName="extCapacity" />
            <input
              type="text"
              maxLength="4"
              className="form-control capacityInput"
              id="extCapacity"
              name="extCapacity"
              value={extCapacity}
              onChange={handleExtCapacityChange}
            />
          </div>
        </div>

        <div className="pure-u-md-12-12 padding-top">
          <div className="pure-u-md-2-12">Session frequency</div>
          <div className="pure-u-md-3-12">{frequencySelect}</div>
        </div>

        <div className="pure-u-md-8-12 padding-top-large margin-top">
          <div className="pure-u-md-10-12">
            <div className="buttonGroup">
              <button
                type="button"
                id="save-button"
                className="button button-save"
                onClick={() => handleUpdate(history)}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

KeyworkerSettings.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleAllowAutoChange: PropTypes.func.isRequired,
  handleCapacityChange: PropTypes.func.isRequired,
  handleExtCapacityChange: PropTypes.func.isRequired,
  handleSequenceFrequency: PropTypes.func.isRequired,
  user: userType.isRequired,
  allowAuto: PropTypes.bool.isRequired,
  migrated: PropTypes.bool.isRequired,
  supported: PropTypes.bool.isRequired,
  sequenceFrequency: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  capacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  extCapacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
}

export default KeyworkerSettings
