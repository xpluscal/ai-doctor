<script>
    export let steps = [{
        title: 'Description',
        content: 'Step 1 content'
    }, {
        title: 'Information',
        content: 'Step 2 content'
    }, {
        title: 'Additional Context',
        content: 'Step 3 content'
    }];

    export let current = 0;
</script>

<style>
    .steps {
        display: flex;
        flex-direction: row;
        align-items: center;
        counter-reset: section;
    }

    .steps div {
        flex: 1;
        text-align: center;
        padding: 1rem;
    }

    .steps div::before {
        counter-increment: section;
        content: counter(section);
        display: flex;
        width: 2rem;
        height: 2rem;
        line-height: 0;
        border-radius: 50%;
        background: #ccc;
        padding: 0.5rem;
        margin-right: 1rem;
        margin-top: 1rem;
    }

    .active{
        font-weight: bold;
    }
</style>

<div class="steps">
    {#each steps as step, index}
        <div class="{index === current ? "active" : ""}">
            <span>{step.title}</span>
        </div>
    {/each}
</div>