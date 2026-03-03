function App() {
  return (
    <main className="container">
      <nav>
        <ul>
          <li><strong>Clínica Vida+</strong></li>
        </ul>
        <ul>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato" role="button">Agendar</a></li>
        </ul>
      </nav>

      <header>
        <h1>Excelência em Atendimento Médico</h1>
        <p>
          Cuidado humanizado, tecnologia avançada e profissionais
          altamente qualificados.
        </p>
        <a href="#contato" role="button">Agende sua Consulta</a>
      </header>

      <section id="servicos">
        <h2>Nossos Serviços</h2>
        <div className="grid">
          <article>
            <h3>Clínico Geral</h3>
            <p>Atendimento completo para todas as idades.</p>
          </article>

          <article>
            <h3>Cardiologia</h3>
            <p>Exames e acompanhamento especializado.</p>
          </article>

          <article>
            <h3>Pediatria</h3>
            <p>Cuidado dedicado à saúde infantil.</p>
          </article>
        </div>
      </section>

      <section id="sobre">
        <h2>Sobre a Clínica</h2>
        <p>
          Nossa missão é oferecer atendimento médico de qualidade,
          com ética, segurança e acolhimento.
        </p>
      </section>

      <section id="contato">
        <h2>Agende sua Consulta</h2>
        <form>
          <label>
            Nome
            <input type="text" placeholder="Seu nome completo" required />
          </label>

          <label>
            Email
            <input type="email" placeholder="Seu email" required />
          </label>

          <label>
            Mensagem
            <textarea placeholder="Descreva sua necessidade"></textarea>
          </label>

          <button type="submit">Enviar</button>
        </form>
      </section>

      <footer>
        <small>© 2026 Clínica Vida+ - Todos os direitos reservados</small>
      </footer>
    </main>
  )
}

export default App