import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@repo/elements/confirmation";
import { CheckIcon, XIcon } from "lucide-react";

const Sidebar = () => (
  <aside className="sidebar" aria-label="Workspace sidebar">
    <p className="brand-name">AI OPERATIONS</p>

    <nav className="primary-navigation" aria-label="Primary">
      <ul>
        <li className="navigation-item navigation-item-active">
          <a href="/" aria-current="page">
            Workspace
          </a>
        </li>
        <li className="navigation-item">
          <span>Runs</span>
        </li>
        <li className="navigation-item">
          <span>Policies</span>
        </li>
      </ul>
    </nav>

    <section className="environment" aria-labelledby="environment-label">
      <h2 className="environment-label" id="environment-label">
        ENVIRONMENT
      </h2>
      <p className="environment-value">Production</p>
      <p className="environment-region">us-east-1</p>
    </section>
  </aside>
);

const PendingApproval = () => (
  <section className="pending-approval" aria-labelledby="pending-title">
    <div className="section-heading pending-heading">
      <h2 id="pending-title">Pending approval</h2>
      <p>Requires your decision</p>
    </div>

    <Confirmation
      approval={{ id: "delete-file-request" }}
      className="confirmation-card request-card"
      state="approval-requested"
    >
      <ConfirmationTitle>
        <ConfirmationRequest>
          This tool wants to delete the file{" "}
          <code>/tmp/example.txt</code>. Do you approve this action?
        </ConfirmationRequest>
      </ConfirmationTitle>
      <ConfirmationActions>
        <ConfirmationAction variant="outline">Reject</ConfirmationAction>
        <ConfirmationAction>Approve</ConfirmationAction>
      </ConfirmationActions>
    </Confirmation>
  </section>
);

const RecentDecisions = () => (
  <section className="recent-decisions" aria-labelledby="recent-title">
    <div className="section-heading recent-heading">
      <h2 id="recent-title">Recent decisions</h2>
      <p>Last 15 minutes</p>
    </div>

    <div className="recent-list">
      <Confirmation
        approval={{ approved: true, id: "approved-delete-file" }}
        className="confirmation-card response-card"
        state="approval-responded"
      >
        <ConfirmationTitle>
          <ConfirmationAccepted>
            <span className="decision-content">
              <CheckIcon aria-hidden="true" className="decision-icon" />
              <span>You approved this tool execution</span>
            </span>
          </ConfirmationAccepted>
        </ConfirmationTitle>
      </Confirmation>

      <Confirmation
        approval={{ approved: false, id: "rejected-delete-file" }}
        className="confirmation-card response-card"
        state="output-denied"
      >
        <ConfirmationTitle>
          <ConfirmationRejected>
            <span className="decision-content">
              <XIcon aria-hidden="true" className="decision-icon" />
              <span>You rejected this tool execution</span>
            </span>
          </ConfirmationRejected>
        </ConfirmationTitle>
      </Confirmation>
    </div>
  </section>
);

const RunDetails = () => (
  <aside
    className="run-details"
    aria-labelledby="run-details-title"
    role="region"
  >
    <h2 id="run-details-title">Run details</h2>
    <dl>
      <div>
        <dt>AGENT</dt>
        <dd>filesystem-assistant</dd>
      </div>
      <div>
        <dt>ACTION</dt>
        <dd>Delete file</dd>
      </div>
      <div>
        <dt>TARGET</dt>
        <dd>/tmp/example.txt</dd>
      </div>
    </dl>
  </aside>
);

export const App = () => (
  <div className="approval-workspace" id="workspace">
    <Sidebar />

    <main className="workspace-main">
      <header className="page-header">
        <p className="page-eyebrow">TOOL GOVERNANCE</p>
        <h1>Approval workspace</h1>
        <p className="page-subtitle">
          Review pending tool calls and recent decisions.
        </p>

        <div className="pending-badge" aria-label="1 pending approval">
          <span className="pending-dot" aria-hidden="true" />
          <span>1 pending</span>
        </div>
      </header>

      <div className="workspace-grid">
        <div className="decisions-column">
          <PendingApproval />
          <RecentDecisions />
        </div>
        <RunDetails />
      </div>

      <footer className="workspace-footer">
        <p>Decisions are logged and attached to the run audit trail.</p>
        <p>Updated just now</p>
      </footer>
    </main>
  </div>
);
