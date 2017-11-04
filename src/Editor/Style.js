import React from 'react'
import css from '../constants/css'

const prismStyling = <style type="text/css" dangerouslySetInnerHTML={{ __html: css }} />

export default () => prismStyling
