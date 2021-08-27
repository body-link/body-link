declare module 'agendash' {
  import { Agenda } from 'agenda';
  const agendash: (agenda: Agenda, options: { middleware: string }) => any;
  export default agendash;
}
