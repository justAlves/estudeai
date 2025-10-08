const InvitationTemplate = (
  organizationName: string,
  organizationId: string,
  userName: string,
  inviteLink: string
) => `
  <div style="font-family: Arial, sans-serif; color: #222;">
    <h2>Olá, ${userName}!</h2>
    <p>
      Você foi convidado para se juntar à organização <strong>${organizationName}</strong>.
    </p>
    <p>
      Para aceitar o convite e começar a colaborar, clique no botão abaixo:
    </p>
    <p>
      <a href="${inviteLink}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color:rgb(5, 138, 16);
        color: #fff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      ">
        Aceitar convite
      </a>
    </p>
    <p>
      Se você não esperava este convite, pode ignorar este e-mail.
    </p>
    <hr>
    <small>
      Organização ID: ${organizationId}
    </small>
  </div>
`;

export default InvitationTemplate;