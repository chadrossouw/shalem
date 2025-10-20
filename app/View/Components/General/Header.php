<?php

namespace App\View\Components\General;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Header extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct(
        public string $title = '',
        public array $classes = [],
        public array $meta = []
    )
    {
        //
        if(!$this->title) $this->title = env('APP_NAME');
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.general.header');
    }
}
