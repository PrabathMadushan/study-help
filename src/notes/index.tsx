import type { ReactNode } from 'react'

// React
import ReactHooksBasics from './front-end/react/ReactHooksBasics'
import UseMemoUseCallbackUseRef from './front-end/react/UseMemoUseCallbackUseRef'
import CustomHooks from './front-end/react/CustomHooks'
import Performance from './front-end/react/Performance'
import ReconciliationKeys from './front-end/react/ReconciliationKeys'
import ErrorBoundaries from './front-end/react/ErrorBoundaries'
import ContextVsRedux from './front-end/react/ContextVsRedux'
import CompoundComponents from './front-end/react/CompoundComponents'
import DataFetching from './front-end/react/DataFetching'
import TypeScriptWithReact from './front-end/react/TypeScriptWithReact'

// JavaScript
import Closures from './front-end/javascript/Closures'
import ThisKeyword from './front-end/javascript/ThisKeyword'
import Prototypes from './front-end/javascript/Prototypes'
import Hoisting from './front-end/javascript/Hoisting'
import EventLoop from './front-end/javascript/EventLoop'
import Promises from './front-end/javascript/Promises'
import AsyncAwait from './front-end/javascript/AsyncAwait'
import DebounceThrottle from './front-end/javascript/DebounceThrottle'

// TypeScript
import Interfaces from './front-end/typescript/Interfaces'
import TypesVsInterfaces from './front-end/typescript/TypesVsInterfaces'
import UtilityTypes from './front-end/typescript/UtilityTypes'

// CSS
import CssFlexbox from './front-end/css/CssFlexbox'
import CssGrid from './front-end/css/CssGrid'
import CssAnimations from './front-end/css/CssAnimations'

// Tailwind
import TailwindUtility from './front-end/tailwind/TailwindUtility'

// More (frontend)
import FrontEndInterviewTips from './front-end/more/FrontEndInterviewTips'

// Back-end
import RestApiBasics from './back-end/RestApiBasics'
import JwtAuth from './back-end/JwtAuth'

// DevOps
import CicdPipeline from './devops/CicdPipeline'
import DockerBasics from './devops/DockerBasics'

// Design Patterns
import SingletonPattern from './design-patterns/SingletonPattern'
import ObserverPattern from './design-patterns/ObserverPattern'

// Data Structures
import ArraysAndObjects from './data-structures/ArraysAndObjects'
import LinkedList from './data-structures/LinkedList'

// Algorithms
import BigOBasics from './algorithms/BigOBasics'
import BinarySearch from './algorithms/BinarySearch'

// Behavior Questions
import StarMethod from './behavior-questions/StarMethod'
import WhyThisCompany from './behavior-questions/WhyThisCompany'

// More (general)
import StudyTips from './more/StudyTips'

export type NoteContentMap = Record<string, () => ReactNode>

export const noteContents: NoteContentMap = {
  'react-hooks-basics': () => <ReactHooksBasics />,
  'react-usememo-usecallback-useref': () => <UseMemoUseCallbackUseRef />,
  'react-custom-hooks': () => <CustomHooks />,
  'react-performance': () => <Performance />,
  'react-reconciliation-keys': () => <ReconciliationKeys />,
  'react-error-boundaries': () => <ErrorBoundaries />,
  'react-context-vs-redux': () => <ContextVsRedux />,
  'react-compound-components': () => <CompoundComponents />,
  'react-data-fetching': () => <DataFetching />,
  'react-typescript': () => <TypeScriptWithReact />,
  'js-closures': () => <Closures />,
  'js-this-keyword': () => <ThisKeyword />,
  'js-prototypes': () => <Prototypes />,
  'js-hoisting': () => <Hoisting />,
  'js-event-loop': () => <EventLoop />,
  'js-promises': () => <Promises />,
  'js-async-await': () => <AsyncAwait />,
  'js-callbacks': () => <Closures />,
  'js-destructuring': () => <Closures />,
  'js-arrow-functions': () => <Closures />,
  'js-modules': () => <Closures />,
  'js-classes': () => <Closures />,
  'js-currying': () => <Closures />,
  'js-debounce-throttle': () => <DebounceThrottle />,
  'js-generators': () => <Closures />,
  'js-proxy-reflect': () => <Closures />,
  'ts-types-interfaces': () => <TypesVsInterfaces />,
  'ts-type-inference': () => <Interfaces />,
  'ts-union-intersection': () => <Interfaces />,
  'ts-enums-literals': () => <Interfaces />,
  'ts-interfaces': () => <Interfaces />,
  'ts-generic-functions': () => <UtilityTypes />,
  'ts-utility-types': () => <UtilityTypes />,
  'ts-generic-classes': () => <UtilityTypes />,
  'ts-conditional-types': () => <UtilityTypes />,
  'ts-mapped-types': () => <UtilityTypes />,
  'ts-template-literals': () => <UtilityTypes />,
  'tailwind-utility': () => <TailwindUtility />,
  'tailwind-customization': () => <TailwindUtility />,
  'css-flexbox': () => <CssFlexbox />,
  'css-grid': () => <CssGrid />,
  'css-positioning': () => <CssFlexbox />,
  'css-box-model': () => <CssFlexbox />,
  'css-media-queries': () => <CssFlexbox />,
  'css-mobile-first': () => <CssFlexbox />,
  'css-responsive-units': () => <CssFlexbox />,
  'css-animations': () => <CssAnimations />,
  'css-transitions': () => <CssAnimations />,
  'css-pseudo-elements': () => <CssFlexbox />,
  'css-variables': () => <CssFlexbox />,
  'front-end-interview-tips': () => <FrontEndInterviewTips />,
  'rest-api-basics': () => <RestApiBasics />,
  'jwt-auth': () => <JwtAuth />,
  'cicd-pipeline': () => <CicdPipeline />,
  'docker-basics': () => <DockerBasics />,
  'singleton-pattern': () => <SingletonPattern />,
  'observer-pattern': () => <ObserverPattern />,
  'arrays-and-objects': () => <ArraysAndObjects />,
  'linked-list': () => <LinkedList />,
  'big-o-basics': () => <BigOBasics />,
  'binary-search': () => <BinarySearch />,
  'star-method': () => <StarMethod />,
  'why-this-company': () => <WhyThisCompany />,
  'general-tips': () => <StudyTips />,
}
