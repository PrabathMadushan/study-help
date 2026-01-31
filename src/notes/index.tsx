import type { ReactNode } from 'react'
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
import Closures from './front-end/javascript/Closures'
import Interfaces from './front-end/typescript/Interfaces'
import TailwindUtility from './front-end/tailwind/TailwindUtility'
import CssFlexbox from './front-end/css/CssFlexbox'
import FrontEndInterviewTips from './front-end/more/FrontEndInterviewTips'
import RestApiBasics from './back-end/RestApiBasics'
import JwtAuth from './back-end/JwtAuth'
import CicdPipeline from './devops/CicdPipeline'
import DockerBasics from './devops/DockerBasics'
import SingletonPattern from './design-patterns/SingletonPattern'
import ObserverPattern from './design-patterns/ObserverPattern'
import ArraysAndObjects from './data-structures/ArraysAndObjects'
import LinkedList from './data-structures/LinkedList'
import BigOBasics from './algorithms/BigOBasics'
import BinarySearch from './algorithms/BinarySearch'
import StarMethod from './behavior-questions/StarMethod'
import WhyThisCompany from './behavior-questions/WhyThisCompany'
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
  'ts-interfaces': () => <Interfaces />,
  'tailwind-utility': () => <TailwindUtility />,
  'css-flexbox': () => <CssFlexbox />,
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
