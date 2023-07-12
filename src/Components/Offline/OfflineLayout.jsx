import React from 'react'
import './OfflineLayout.css'
export default function OfflineLayout() {
  return <>
    <div id='offline'>
    <div className="caption text-center">
    <h1>Check Your Connection</h1>
    <span>You Don't seem to have an active internet connection</span><br />
    <span>Please check your connection and try again</span>
    </div>
    </div>
  </>
}
